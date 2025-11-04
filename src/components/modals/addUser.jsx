import React, { useState, useEffect } from "react";
import { useGET } from "../../hooks/useGET";
import { Modal, ModalDialog } from "@mui/joy";

const ModalAsignarUsuario = ({ isOpen, onClose, onAsignar, routineId }) => {
    const [selectedUser, setSelectedUser] = useState("");

    const [users, loading, error] = useGET(`users/findlist`);

    const handleAsignar = () => {
        if (!selectedUser) return;
        onAsignar(routineId, selectedUser);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="outlined"
                role="dialog"
                layout="center"
                sx={{
                    maxWidth: 800,
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    backgroundColor: 'black'
                }}
            >
                <div className="bg-zinc-900 text-white p-6 rounded-lg w-full max-w-md border border-zinc-700">
                    <h2 className="text-xl font-bold mb-4">Asignar rutina a un usuario</h2>

                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-600 mb-4"
                    >
                        <option value="">Seleccionar usuario</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} {u.lastname}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-between gap-2">
                        <button
                            onClick={onClose}
                            className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleAsignar}
                            className="bg-yellow-400 hover:bg-yellow-700 px-3 py-1 rounded cursor-pointer text-black"
                        >
                            Asignar
                        </button>
                    </div>
                </div>
            </ModalDialog>
        </Modal >
    );
};

export default ModalAsignarUsuario;
