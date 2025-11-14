import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalPostOfficeIcon from "@mui/icons-material/LocalPostOffice";
import MenuIcon from "@mui/icons-material/Menu";
import KeyIcon from '@mui/icons-material/Key';
import CloseIcon from "@mui/icons-material/Close";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../../utils/auth";

export default function TopNav() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const handleUserClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
    const user = getUser();

    const sections = [
        { id: "sales", label: "Estampillas digitales", path: "/online_stamps" },
        { id: "finals", label: "Estampillas físicas", path: "/physical_stamps" },
    ];

    return (
        <nav className="bg-white shadow-md px-4 py-3 flex justify-between items-center relative z-20">
            <div className="flex items-center space-x-2">
                <img
                    src={"src/assets/logo_ck.png"}
                    alt="logo"
                    style={{
                        width: 50,
                        height: 50,
                        objectFit: "contain"
                    }}
                />
                <span className="hidden sm:inline font-semibold text-gray-800 select-none text-sm sm:text-base">
                    Gestión de Estampillas Digitales
                </span>
            </div>


            <div className="hidden md:flex space-x-8 relative">
                {sections.map((sec) => {
                    const isActive =
                        location.pathname === sec.path ||
                        (location.pathname === "/checkout_stamps" && sec.path === "/online_stamps");

                    return (
                        <div key={sec.id} className="relative">
                            <NavLink
                                to={sec.path}
                                className={`text-sm font-medium transition-colors duration-300 ${isActive
                                    ? "text-indigo-600"
                                    : "text-gray-600 hover:text-indigo-500"
                                    }`}
                            >
                                {sec.label}
                            </NavLink>
                            {isActive && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute left-0 right-0 h-[2px] bg-indigo-600 rounded-full bottom-[-4px]"
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center space-x-1">
                <IconButton onClick={handleUserClick} size="small">
                    <AccountCircleIcon className="text-gray-700" fontSize="medium" />
                </IconButton>

                <div className="md:hidden">
                    <IconButton onClick={toggleMobileMenu}>
                        {mobileOpen ? (
                            <CloseIcon className="text-gray-700" />
                        ) : (
                            <MenuIcon className="text-gray-700" />
                        )}
                    </IconButton>
                </div>
            </div>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                sx={{
                    "& .MuiPaper-root": {
                        minWidth: 200,
                        paddingY: 0.3,
                        boxShadow: 3,
                    },
                    "& .MuiMenuItem-root": {
                        fontSize: "0.8rem",
                        paddingY: 0.4,
                        paddingX: 1.2,
                    },
                }}
            >
                <MenuItem disabled>
                    <div className="flex items-center justify-center gap-1 text-gray-700 w-full">
                        <KeyIcon className="w-3 h-3 text-gray-500" />
                        <span>{user.usuario}</span>
                    </div>
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        navigate("/login");
                        removeToken();
                        handleClose();
                    }}
                >
                    <div className="flex items-center justify-center w-full">
                        Cerrar sesión
                    </div>
                </MenuItem>
            </Menu>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full bg-white shadow-md md:hidden flex flex-col items-start px-6 py-3 space-y-3"
                    >
                        {sections.map((sec) => {
                            const isActive = location.pathname === sec.path;
                            return (
                                <NavLink
                                    key={sec.id}
                                    to={sec.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`text-sm font-medium w-full transition-colors duration-300 ${isActive
                                        ? "text-indigo-600"
                                        : "text-gray-700 hover:text-indigo-500"
                                        }`}
                                >
                                    {sec.label}
                                </NavLink>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
