import moment from "moment";

export const validateEmail=(email)=>{
    const regex = /^([a-zA-Z][a-zA-Z0-9._%-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return regex.test(email);
}
export const passwordCheck=(password)=>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}


export const getInitials=(fullName)=>{
    if (!fullName) return '';
    const names = fullName.split(' ');
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
}


export const addThousandSeperator=(num)=>{
    if (typeof num !== 'number') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export const prepareExpenseBarChartData=(data=[])=>{
            const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date))
            
            const chartData=sortedData.map((item)=>({
                month:moment(item?.date).format("DD MMM"),
                category:item?.category,
                amount:item?.amount, 
    }))
    return chartData
}


export const prepareIncomeBarChartData=(data=[])=>{
    const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date))

    const chartData=sortedData.map((item)=>({
        month:moment(item?.date).format("DD MMM"),
        amount:item?.amount,
        source:item?.source
    }))
    return chartData
}


export const prepareExpenseLineChartData=(data=[])=>{
            const sortedData=[...data].sort((a,b)=>new Date(a.date)-new Date(b.date))
            
            const chartData=sortedData.map((item)=>({
                month:moment(item?.date).format("DD MMM"),
                category:item?.category,
                amount:item?.amount, 
    }))
    return chartData
}







