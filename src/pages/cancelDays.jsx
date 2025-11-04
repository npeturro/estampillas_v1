import { useNavigate } from 'react-router-dom';
import SettingsInfo from '../sections/settings/settings-info';
import CancelTable from '../sections/cancel/cancel-table';

export default function CancelDays() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Días recurrentes/eventos
            </h2>
            <CancelTable />

        </div>
    );
}