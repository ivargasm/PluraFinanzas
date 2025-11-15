"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import {useAuthStore} from "../store/Store";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userAuth, logout } = useAuthStore();

    return (
        <nav className="fixed top-0 left-0 w-full bg-white dark:bg-teal-900 border-b border-gray-200 dark:border-teal-800 shadow-sm z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="text-xl font-bold text-teal-900 dark:text-white">PluraFinanzas</span>
                </Link>

                <button
                    className="md:hidden text-foreground"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                <ul className="hidden md:flex space-x-6 items-center">
                    {!userAuth && (
                        <>
                            <li>
                                <Link href="/#caracteristicas" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Características
                                </Link>
                            </li>
                            <li>
                                <Link href="/#precios" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Precios
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link href="/auth/register" className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg">
                                    Regístrate Gratis
                                </Link>
                            </li>
                        </>
                    )}
                    {userAuth && (
                        <>
                            <li>
                                <Link href="/dashboard" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/transactions" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Transacciones
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/reports" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Reportes
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-gray-700 dark:text-teal-100 hover:text-teal-700 dark:hover:text-white transition">
                                    Perfil
                                </Link>
                            </li>
                            <li>
                                <button onClick={() => { logout(); }} className="text-gray-700 dark:text-teal-100 hover:text-coral-500 dark:hover:text-coral-400 transition flex items-center gap-2">
                                    <LogOut size={18} /> Salir
                                </button>
                            </li>
                        </>
                    )}
                    <ThemeToggle />
                </ul>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white dark:bg-teal-900 border-b border-gray-200 dark:border-teal-800 shadow-lg">
                    <ul className="flex flex-col items-center space-y-4 py-4">
                        {!userAuth && (
                            <>
                                <li>
                                    <Link href="/#caracteristicas" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Características
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/#precios" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Precios
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/auth/login" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Iniciar Sesión
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/auth/register" className="bg-coral-500 hover:bg-coral-600 text-white px-6 py-2 rounded-lg font-medium" onClick={() => setMenuOpen(false)}>
                                        Regístrate Gratis
                                    </Link>
                                </li>
                            </>
                        )}
                        {userAuth && (
                            <>
                                <li>
                                    <Link href="/dashboard" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/transactions" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Transacciones
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/dashboard/reports" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Reportes
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profile" className="text-gray-700 dark:text-teal-100" onClick={() => setMenuOpen(false)}>
                                        Perfil
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => { logout(); setMenuOpen(false); }} className="text-coral-500 dark:text-coral-400 flex items-center gap-2">
                                        <LogOut size={18} /> Salir
                                    </button>
                                </li>
                            </>
                        )}
                        <ThemeToggle />
                    </ul>
                </div>
            )}
        </nav>
    );
}
