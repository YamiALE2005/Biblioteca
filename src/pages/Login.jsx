import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';

const Login = () => {
    const usenavigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        matricula: '',
        carrera: 'Ingeniería en Desarrollo y Gestión de Software'
    });

    // Redirigir al dashboard si la sesión ya existe
    useEffect(() => {
        const sessionExistente = sessionStorage.getItem('sesion_estadia');
        console.log(sessionExistente);
        if (sessionExistente){
            navigate('/dashboard')
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.matricula) {
        alert('Por favor complete los campos obligatorios');
        return;
        }

        const payload = {
        ...formData,
        proyecto: '',
        empresa: '',
        fechaIngreso: new Date().toLocaleTimeString()
        };
        console.log(payload)
        sessionStorage.setItem('sesion_estadia', JSON.stringify(payload));
        navigate('/dashboard')

    };

    return (
        <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.card}>
            <h2 style={styles.title}>Acceso a Estadías UTR</h2>
            <div style={styles.group}>
            <label>Nombre Completo:</label>
            <input 
                type="text" 
                name="nombre" 
                value={formData.nombre} 
                onChange={handleChange} 
                style={styles.input}
                placeholder="Ej. Juan Pérez"
                required 
            />
            </div>
            <div style={styles.group}>
            <label>Matrícula:</label>
            <input 
                type="text" 
                name="matricula" 
                value={formData.matricula} 
                onChange={handleChange} 
                style={styles.input}
                placeholder="Ej. 21000123"
                required 
            />
            </div>
            <div style={styles.group}>
            <label>Carrera:</label>
            <input 
                type="text" 
                name="carrera" 
                value={formData.carrera} 
                disabled 
                style={{ ...styles.input, backgroundColor: '#f1f5f9' }} 
            />
            </div>
            <button type="submit" style={styles.button}>Iniciar Sesión</button>
        </form>
        </div>
    );
    }
    const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
    card: { background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { marginBottom: '1.5rem', textAlign: 'center', color: '#1e293b' },
    group: { marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' },
    input: { padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.9rem' },
    button: { width: '100%', padding: '0.75rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }
    };

    export default Login;