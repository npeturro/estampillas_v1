import { useNavigate } from 'react-router-dom';
import SettingsInfo from '../sections/settings/settings-info';
import RatesInfo from '../sections/settings/rates-info';

export default function Settings() {
    const navigate = useNavigate();

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Configuraciones
            </h2>
            <SettingsInfo />
            <RatesInfo />

        </div>
    );
}