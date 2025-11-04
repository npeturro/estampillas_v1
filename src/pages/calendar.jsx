import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarAppointments from '../sections/appointments/calendar-appointments';

export default function Calendar() {
    const navigate = useNavigate();


    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Calendario
            </h2>
            <div className="h-full">
                <CalendarAppointments />
            </div>
        </div>
    );
}