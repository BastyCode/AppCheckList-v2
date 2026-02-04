
import toast from 'react-hot-toast'
import { FileWarning, FileCheck, Printer, Loader2 } from 'lucide-react'

export async function startPdfCountdown(generateFn: () => Promise<void>) {
    // Initial toast
    const toastId = toast.loading(
        <div className="flex flex-col gap-1">
             <span className="font-bold text-lg">Generando PDF...</span>
             <span className="text-base opacity-90">Preparando documento</span>
        </div>, 
        {
        icon: <div className="relative">
                <Printer className="h-8 w-8 text-indigo-600" />
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400 absolute -bottom-1 -right-1" />
              </div>,
        style: {
            background: '#ffffff',
            color: '#312e81', // indigo-900
            padding: '16px 24px',
            borderRadius: '16px',
            border: '2px solid #e0e7ff', // indigo-100
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            minWidth: '380px',
            maxWidth: '500px'
        },
        duration: Infinity
    })

    const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

    await wait(1000);
    toast.loading(
        <div className="flex flex-col gap-1">
             <span className="font-bold text-lg">Generando PDF...</span>
             <span className="text-base opacity-90">Quedan 2 segundos...</span>
        </div>, 
        { id: toastId }
    );
    
    await wait(1000);
    toast.loading(
        <div className="flex flex-col gap-1">
             <span className="font-bold text-lg">Generando PDF...</span>
             <span className="text-base opacity-90">Quedan 1 segundo...</span>
        </div>, 
        { id: toastId }
    );
    
    await wait(1000);

    try {
        await generateFn();
        // Success toast
        toast.success(
            <div className="flex flex-col gap-1">
                <span className="font-bold text-lg">¡PDF Generado!</span>
                <span className="text-base opacity-90">Descarga iniciada correctamente.</span>
            </div>, 
            { 
            id: toastId,
            icon: <FileCheck className="h-10 w-10 text-emerald-500" />, 
            duration: 4000,
            style: {
                background: '#ffffff', 
                color: '#064e3b', // emerald-900
                padding: '20px 24px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '2px solid #d1fae5', // emerald-100
                minWidth: '400px'
            }
        });
    } catch (e) {
        console.error(e)
        // Error toast (via catch)
        toast.error(
            <div className="flex flex-col gap-1">
                <span className="font-bold text-lg">Error al generar PDF</span>
                <span className="text-base opacity-90">Por favor revisa los datos.</span>
            </div>, 
            { 
            id: toastId,
            icon: <FileWarning className="h-10 w-10 text-red-600" />, 
            duration: 5000,
            style: {
                background: '#ffffff', 
                color: '#991b1b', // red-800
                padding: '20px 24px',
                borderRadius: '16px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '2px solid #fca5a5', // red-300
                minWidth: '400px'
            }
        });
    }
}

// Utility separate for validation or other specific errors
export function showErrorToast(message: string, id?: string) {
    toast.error(
        <div className="flex flex-col gap-1">
            <span className="font-bold text-lg">¡Atención!</span>
            <span className="text-base opacity-90">{message}</span>
        </div>, 
        { 
        id: id,
        icon: <FileWarning className="h-10 w-10 text-red-600" />, 
        duration: 4000,
        style: {
            background: '#ffffff', 
            color: '#991b1b', // red-800
            padding: '20px 24px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '2px solid #fca5a5', // red-300
            minWidth: '400px'
        }
    });
}
