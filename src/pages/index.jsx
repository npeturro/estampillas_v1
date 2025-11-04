import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationModal from './appointment';
import { motion } from "framer-motion";
import RoomIcon from "@mui/icons-material/Room";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CopyrightIcon from "@mui/icons-material/Copyright";
import PersonIcon from '@mui/icons-material/Person';

const Index = () => {

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans overflow-x-hidden">
                <nav className="fixed w-full z-50 backdrop-blur-md bg-white/80 shadow-xl border-b border-gray-200/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">

                            <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">P</span>
                                </div>
                                <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-700 bg-clip-text text-transparent">
                                    PádelPro
                                </h1>

                            </div>


                            <div className="flex items-center space-x-8">
                                <div className="hidden md:flex items-center space-x-8">
                                    <a href="#inicio" className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 transform hover:scale-105">
                                        Inicio
                                    </a>
                                    <a href="#canchas" className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 transform hover:scale-105">
                                        Canchas
                                    </a>
                                    <a href="#precios" className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 transform hover:scale-105">
                                        Precios
                                    </a>
                                    <a href="#contacto" className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 transform hover:scale-105">
                                        Contacto
                                    </a>
                                </div>
                            </div>

                            <div >
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="cursor-pointer bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Reservar ahora
                                </button>
                                <PersonIcon onClick={() => navigate('/login')} className="text-gray-700 hover:text-green-600 cursor-pointer transition-colors duration-300 ml-5" />
                            </div>
                        </div>

                    </div>
                </nav>

                <section
                    id="inicio"
                    className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900 text-white"
                >
                    {/* Fondo con overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1612534847738-b3af9bc31f0c?q=80&w=1920&auto=format&fit=crop')",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

                    {/* Contenido principal */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="relative z-10 max-w-5xl text-center px-6 md:px-8"
                    >
                        <motion.h1
                            className="text-5xl md:text-5xl font-extrabold mb-6 leading-tight"
                            whileHover={{ scale: 1.02 }}
                        >
                            ¡Reserva tu <span className="text-green-400">cancha!</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            Canchas de pádel premium con un clic. Horarios flexibles, instalaciones 24/7 y experiencias únicas para jugadores apasionados.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row gap-5 justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        >
                            <button onClick={() => setIsModalOpen(true)} className="cursor-pointer bg-green-500 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-green-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Reservar ahora
                            </button>
                            <button className="border-2 border-white text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105">
                                Ver canchas
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Efectos decorativos */}
                    <div className="absolute -top-32 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-[bounce_6s_infinite]"></div>
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
                </section>


                <section id="contacto" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h3 className="text-4xl md:text-5xl font-black text-center text-gray-800 mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Contacto
                        </h3>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Mapa */}
                            <div className="relative p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-xl border border-blue-100/50">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -mr-12 -mt-12 opacity-50"></div>
                                <div className="relative z-10 w-full h-64 rounded-xl overflow-hidden shadow-md">
                                    <iframe
                                        title="Ubicación Google Maps"
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.123456789!2d-58.381592!3d-34.603722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccabc1234567%3A0x123456789abcdef!2sOvidios+Lagos+3559!5e0!3m2!1ses-419!2sar!4v1690000000000!5m2!1ses-419!2sar"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Información de contacto */}
                            <div className="relative p-8 bg-gradient-to-br from-gray-50 to-green-50 rounded-3xl shadow-xl border border-green-100/50">
                                <div className="absolute top-0 left-0 w-24 h-24 bg-green-200 rounded-full -ml-12 -mt-12 opacity-50"></div>
                                <div className="relative z-10 space-y-6 text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <RoomIcon className="text-green-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Dirección</h4>
                                            <p>Av. Ovidios Lagos 3559, Rosario, Argentina</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <PhoneIcon className="text-green-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Teléfono</h4>
                                            <p>+54 11 1234-5678</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <EmailIcon className="text-green-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Email</h4>
                                            <p>contacto@padel.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <AccessTimeIcon className="text-green-600" />
                                        <div>
                                            <h4 className="text-sm font-semibold mb-1">Horarios</h4>
                                            <p>Lunes a Domingo: 08:00 - 22:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Footer - Más limpio con icons */}
                <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-transparent to-transparent"></div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h4 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            Comenza a jugar!
                        </h4>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-gray-300 text-sm">
                        <div className="flex items-center gap-1">
                            <CopyrightIcon fontSize="small" />
                            <span>2025 DEVNICOLAS. Todos los derechos reservados.</span>
                        </div>
                    </div>
                </footer >
            </div>
            <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Index;
