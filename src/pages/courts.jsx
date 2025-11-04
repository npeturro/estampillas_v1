import { useNavigate } from 'react-router-dom';
import SettingsInfo from '../sections/settings/settings-info';
import CancelTable from '../sections/cancel/cancel-table';
import CourtDetail from '../sections/courts/court-details';

export default function Courts() {
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Canchas
            </h2>
            <CourtDetail />

        </div>
    );
}