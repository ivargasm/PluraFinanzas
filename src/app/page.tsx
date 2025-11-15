'use client';

import Link from 'next/link';
import Navbar from './components/navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 to-teal-900">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Tus finanzas, por fin<br />
              <span className="text-teal-200">en sintonía grupal</span>
            </h1>
            <p className="text-xl mb-4 text-teal-50">
              PluraFinanzas es te app que te permite gensitar gastos compartidos y personales sin efoutto
            </p>
            <p className="text-lg text-coral-300 mb-8">
              Registra gastos en segundos desde tu chat de WhatsApp o Telegram
            </p>

            {/* Pain Points */}
            <div className="mb-8">
              <p className="text-lg mb-4 text-teal-100">¿Cansado de la gestión financiras tradicionals?</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💸</span>
                  </div>
                  <p className="text-sm text-teal-100">Perder la cuenta</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">😓</span>
                  </div>
                  <p className="text-sm text-teal-100">Pereza de registrar</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-white/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🧮</span>
                  </div>
                  <p className="text-sm text-teal-100">Hojas la cálculo complicadas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative">
            <div className="relative z-10">
              {/* Desktop mockup placeholder */}
              <div className="bg-white rounded-lg shadow-2xl p-4 mb-8">
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <span className="text-gray-400">Dashboard Preview</span>
                </div>
              </div>
              {/* Mobile mockups */}
              <div className="absolute -left-8 bottom-0 w-32 bg-white rounded-2xl shadow-xl p-2">
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Mobile</span>
                </div>
              </div>
              <div className="absolute -right-8 bottom-12 w-32 bg-white rounded-2xl shadow-xl p-2">
                <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                  <span className="text-xs text-gray-400">Mobile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-teal-900 mb-16">
            Características Principales
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-900 mb-4">Workspaces Compartidos</h3>
              <div className="mb-6">
                <p className="text-lg font-bold text-teal-700 mb-2">Free</p>
                <p className="text-4xl font-bold text-teal-900">$0 <span className="text-lg text-gray-500">/mes</span></p>
              </div>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Gastos personales</li>
                <li>• 1 Workspace</li>
                <li>• Registros por chat</li>
              </ul>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-xs text-gray-500">Preview</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-mint-400 to-mint-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-teal-900 mb-4">Registro por Chat</h3>
              <div className="bg-white rounded-xl p-6 mb-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <p className="font-medium">pizza $20</p>
                  <p className="text-xs text-gray-500">Mensaje enviado</p>
                </div>
              </div>
              <div className="text-center">
                <span className="text-3xl">→</span>
              </div>
              <div className="bg-white rounded-xl p-4 mt-4">
                <div className="text-xs text-gray-500">Registrado automáticamente</div>
              </div>
              <button className="w-full mt-6 bg-coral-500 hover:bg-coral-600 text-white py-3 rounded-lg font-medium transition">
                Registro por Chat
              </button>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border-2 border-coral-400">
              <div className="inline-block bg-coral-500 text-white text-xs px-3 py-1 rounded-full mb-4">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-teal-900 mb-4">Dashboard Web Completo</h3>
              <div className="mb-6">
                <p className="text-lg font-bold text-coral-500 mb-2">Premium</p>
                <p className="text-4xl font-bold text-teal-900">$9.99 <span className="text-lg text-gray-500">/mes</span></p>
              </div>
              <ul className="space-y-2 text-gray-700 mb-6">
                <li>• Gastos ilimitados</li>
                <li>• Workspaces ilimitados</li>
                <li>• Dashboard alimentado</li>
                <li>• Soporte prioritario</li>
              </ul>
              <button className="w-full bg-coral-500 hover:bg-coral-600 text-white py-3 rounded-lg font-medium transition">
                Empezar Prueba Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-teal-800 to-teal-900 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Elige tu plan
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-teal-200 mb-8">
            Toma control<br />
            de tus financas<br />
            grupales hoy
          </h3>
          <Link 
            href="/auth/register"
            className="inline-block bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-12 py-4 rounded-lg text-xl font-bold transition shadow-lg hover:shadow-xl"
          >
            Empezar Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-950 text-teal-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-around gap-8">
            <div>
              <h4 className="font-bold text-white mb-4">PluraFinanzas</h4>
              <p className="text-sm">Gestión de finanzas colaborativas simple y efectiva</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#caracteristicas" className="hover:text-white transition">Características</Link></li>
                <li><Link href="#precios" className="hover:text-white transition">Precios</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Soporte</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Ayuda</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contacto</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition">Privacidad</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Términos</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 PluraFinanzas. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
