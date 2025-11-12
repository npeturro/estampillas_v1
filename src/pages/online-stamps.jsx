import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import OnlineStampsTable from '../sections/online-stamps/online-stamps-table';
import { Chip } from '@mui/joy';

export default function OnlineStamps() {
    const navigate = useNavigate();
    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div>
            <div className="flex items-center justify-end mb-4">
                <Chip
                    startDecorator={<AddIcon sx={{ fontSize: 18 }} />}
                    onClick={() => handleNavigate('/checkout_stamps')}
                    color="neutral"
                    size="sm"
                    variant="soft"
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 500,
                        borderRadius: '8px',
                        px: 1.5,
                        py: 0.2,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'neutral.softActiveBg',
                        },
                        '& .MuiChip-startDecorator': {
                            color: 'primary.plainColor',
                        },
                    }}
                >
                    Nueva compra
                </Chip>
            </div>

            <OnlineStampsTable />
        </div>
    );
}
