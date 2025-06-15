import React from 'react'
import { DashboardLayout } from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { API_PATHS } from '../../utils/apiPath'
import axiosInstance from '../../utils/axiosInstance'
import Modal from '../../components/Modal'
import { useState } from 'react'
import { useEffect } from 'react'
import ExpenseOverview from '../../components/Expense/ExpenseOverview'
import AddExpenseForm from '../../components/Expense/AddExpenseForm'
import ExpenseList from '../../components/Expense/ExpenseList'
import DeleteAlert from '../../components/DeleteAlert'
import toast from 'react-hot-toast'



const Expense = () => {
  useUserAuth()

    const [loading, setLoading] = useState(false)
    const [expenseData, setExpenseData] = useState([])
    const [openAddExpenseModel, setOpenAddExpenseModel] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
      show: false,
      data: null
    })


    const fetchExpenseDetails = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)

      if (response.data) {
        setExpenseData(response.data)
      }
    }
    catch (error) {
      console.log("Something went wrong.Please try again. ", error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (expense) => {
    const { category, icon, date, amount } = expense

    if (!category.trim()) {
      toast.error("Category is required")
      return
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be valid number greater than 0.")
      return
    }
    if (!date) {
      toast.error("Date is required")
      return
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        icon,
        date,
        amount
      })
      setOpenAddExpenseModel(false)
      toast.success("Expense added successfully.")
      fetchExpenseDetails()
    } catch (error) {
      console.log("Error adding income", error.response?.data.message || error.message)
    }
  }

  const deleteExpense = async (id) => { 
    try{
      const response=await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      setOpenDeleteAlert({show:false,data:null})
      toast.success("Expense details deleted successfully")
      fetchExpenseDetails()
    }catch(error){
      console.error("Error deleting expense",error.response?.data?.message || error.message)
    }
  }

  const handleDownloadExpenseDetails = async () => {
    try{
      const response=await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,{
        responseType:"blob"
      })
      const url=window.URL.createObjectURL(new Blob([response.data]))
      const link=document.createElement('a')
      link.href=url
      link.setAttribute("download","expense_details.xlsx")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }catch(error){
      console.error("Error downloading expense details",error)
      toast.error("Failed to download expense details.Please try again.")
    }
  }


  useEffect(() => {
    fetchExpenseDetails()

    return () => {}
  }, [])



  return (
<DashboardLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>

          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModel(true)}
          />

        </div>

        <ExpenseList
          transactions={expenseData}
          onDelete={(id) => {
            setOpenDeleteAlert({ show: true, data: id })
          }}
          onDownload={handleDownloadExpenseDetails}
        />
        
      </div>

      <Modal
        isOpen={openAddExpenseModel}
        onClose={() => setOpenAddExpenseModel(false)}
        title="Add Expense"
      >
        <AddExpenseForm onAddExpense={handleAddExpense} />
      </Modal> 


      <Modal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title="Delete Expense"
      >
        <DeleteAlert
          content="Are you sure you want to delete this expense details?"
          onDelete={() => deleteExpense(openDeleteAlert.data)}
        />
      </Modal>

    </DashboardLayout>
  )
}

export default Expense
