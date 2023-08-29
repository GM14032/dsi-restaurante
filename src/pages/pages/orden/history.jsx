import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-toastify/dist/ReactToastify.css';
import OrderPage from "@/Components/orden/OrdenPage";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const getCurrentDateWithoutOffset = () =>{
	const date = new Date();
	return new Date(
		date.getTime() - date.getTimezoneOffset() * 60000
	);
}
const getCurrentDate = () =>{
		return getCurrentDateWithoutOffset().toISOString()
			.split('T')[0];
}

const getRangeDate = ({ startDate, endDate }) =>{
	return {
		startDate: startDate.toISOString()
			.split('T')[0],
		endDate: endDate.toISOString()
			.split('T')[0],
	}
}

function History() {
		const currentDate = getCurrentDateWithoutOffset();
		const [dates, setDates] = useState({
			startDate: {
				date: currentDate,
				valueToFind: `?startDate=${currentDate.toISOString().split('T')[0]}`,
			},
			endDate: {
				date: currentDate,
				valueToFind: `&endDate=${currentDate.toISOString().split('T')[0]}`,
			},
		});

		const handleDate = (date, field = 'startDate') => {
				const initialCharacter = field === 'startDate' || !dates.startDate ? '?' : '&';
				const valueToFind = `${initialCharacter}${field}=${date.toISOString().split('T')[0]}`;
				setDates({
						...dates,
						[field]: {
							date,
							valueToFind,
						},
				});
		}


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <OrderPage allowAdd={false} startDate={dates.startDate.valueToFind} endDate={dates.endDate.valueToFind}>
                <div className='date-picker-order-filter'>
									<div className='date-form-filter'>
											<label htmlFor='startDate'>Inicio</label>
											<DatePicker name='startDate' maxDate={dates.endDate.date} value={dates.startDate.date} onChange={(e)=> {
													handleDate(e);
											}}/>
									</div>
									<div className='date-form-filter'>
											<label htmlFor='endDate'>Fin</label>
											<DatePicker name='endDate' minDate={dates.startDate.date} maxDate={currentDate} value={dates.endDate.date} onChange={(e)=> {
													handleDate(e, 'endDate');
											}} />
									</div>
                </div>
            </OrderPage>
        </LocalizationProvider>
    );
}

export default dynamic(() => Promise.resolve(History), { ssr: false });
