import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, BookOpen, Heart, Globe } from 'lucide-react'
import { PersonIcon, HeartIcon, GlobeIcon } from '@radix-ui/react-icons'

interface FeaturesProps {
  locale?: string;
}

export function Features({ locale = 'es' }: FeaturesProps) {
    return (
        <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-3xl lg:max-w-5xl px-6">
                <div className="text-center mb-16">
                    <h2 
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ color: '#744C7A' }}
                    >
                        {locale === "es" ? "¿Qué puede lograr tu donación?" : "What can your donation achieve?"}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {locale === "es" 
                            ? "Cada donación se transforma en acciones concretas que mejoran vidas"
                            : "Each donation transforms into concrete actions that improve lives"
                        }
                    </p>
                </div>
                <div className="relative">
                    <div className="relative z-10 grid grid-cols-6 gap-3">
                        <Card className="relative col-span-full flex overflow-hidden lg:col-span-2" style={{ backgroundColor: '#744C7A' }}>
                            <CardContent className="relative m-auto size-fit pt-6">
                                <div className="relative flex h-24 w-56 items-center">
                                    <PersonIcon className="absolute inset-0 w-full h-full text-white/20" style={{ fontSize: '8rem' }} />
                                    <span className="mx-auto block w-fit text-5xl font-semibold text-white">809+</span>
                                </div>
                                <h2 className="mt-6 text-center text-2xl font-semibold text-white">
                                    {locale === "es" ? "Jóvenes Formados" : "Young Leaders Trained"}
                                </h2>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border-2 border-purple-200 items-center justify-center">
                                    <BookOpen className="h-16 w-16 text-purple-600" strokeWidth={1.5} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium" style={{ color: '#744C7A' }}>
                                        {locale === "es" ? "Formación Integral" : "Comprehensive Training"}
                                    </h2>
                                    <p className="text-gray-600">
                                        {locale === "es" 
                                            ? "Educación en liderazgo, derechos sexuales y reproductivos para jóvenes" 
                                            : "Leadership education and sexual reproductive rights for youth"
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden sm:col-span-3 lg:col-span-2">
                            <CardContent className="pt-6">
                                <div className="relative mx-auto flex aspect-square size-32 rounded-full border-2 items-center justify-center" style={{ borderColor: '#744C7A', backgroundColor: 'rgba(116, 76, 122, 0.1)' }}>
                                    <GlobeIcon className="h-16 w-16" style={{ color: '#744C7A' }} />
                                </div>
                                <div className="relative z-10 mt-6 space-y-2 text-center">
                                    <h2 className="text-lg font-medium" style={{ color: '#744C7A' }}>
                                        {locale === "es" ? "17 Municipios Alcanzados" : "17 Municipalities Reached"}
                                    </h2>
                                    <p className="text-gray-600">
                                        {locale === "es" 
                                            ? "Presencia activa en 6 departamentos de Bolivia con impacto regional" 
                                            : "Active presence in 6 departments of Bolivia with regional impact"
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border-2 items-center justify-center" style={{ borderColor: '#744C7A', backgroundColor: 'rgba(116, 76, 122, 0.1)' }}>
                                        <HeartIcon className="size-6" style={{ color: '#744C7A' }} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium" style={{ color: '#744C7A' }}>
                                            {locale === "es" ? "Transformación Comunitaria" : "Community Transformation"}
                                        </h2>
                                        <p className="text-gray-600">
                                            {locale === "es" 
                                                ? "Impacto directo en comunidades rurales con programas sostenibles" 
                                                : "Direct impact in rural communities with sustainable programs"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="relative -mb-6 -mr-6 mt-6 h-fit p-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold" style={{ color: '#744C7A' }}>12</div>
                                            <div className="text-sm text-gray-600">
                                                {locale === "es" ? "Años" : "Years"}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold" style={{ color: '#744C7A' }}>6</div>
                                            <div className="text-sm text-gray-600">
                                                {locale === "es" ? "Dptos" : "Depts"}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold" style={{ color: '#744C7A' }}>95%</div>
                                            <div className="text-sm text-gray-600">
                                                {locale === "es" ? "A programas" : "To programs"}
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-lg">
                                            <div className="text-2xl font-bold" style={{ color: '#744C7A' }}>100%</div>
                                            <div className="text-sm text-gray-600">
                                                {locale === "es" ? "Transparencia" : "Transparency"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="relative col-span-full overflow-hidden lg:col-span-3">
                            <CardContent className="grid h-full pt-6 sm:grid-cols-2">
                                <div className="relative z-10 flex flex-col justify-between space-y-12 lg:space-y-6">
                                    <div className="relative flex aspect-square size-12 rounded-full border-2 items-center justify-center" style={{ borderColor: '#744C7A', backgroundColor: 'rgba(116, 76, 122, 0.1)' }}>
                                        <Users className="size-6" style={{ color: '#744C7A' }} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg font-medium" style={{ color: '#744C7A' }}>
                                            {locale === "es" ? "Red de Liderazgo Juvenil" : "Youth Leadership Network"}
                                        </h2>
                                        <p className="text-gray-600">
                                            {locale === "es" 
                                                ? "Conectando jóvenes líderes en toda Bolivia para crear cambio sostenible" 
                                                : "Connecting young leaders across Bolivia to create sustainable change"
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="relative mt-6 sm:-my-6 sm:-mr-6">
                                    <div className="relative flex h-full flex-col justify-center space-y-6 py-6">
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#744C7A' }}>
                                                <span className="text-white font-bold">SC</span>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                                                {locale === "es" ? "Santa Cruz" : "Santa Cruz"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D93069' }}>
                                                <span className="text-white font-bold">LP</span>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                                                {locale === "es" ? "La Paz" : "La Paz"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1BB5A0' }}>
                                                <span className="text-white font-bold">CB</span>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                                                {locale === "es" ? "Cochabamba" : "Cochabamba"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
