from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mint00",
    database="Tesis"
)

# Ruta para el registro de usuarios
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json

    # Obtener los datos del formulario
    Nombre = data.get('nombre')
    Apellido = data.get('apellido')
    Email = data.get('Email')  # Cambiar 'Email' a 'email'
    contrasena = data.get('contrasena')

    # Insertar el usuario en la base de datos
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO usuario (Email, Nombre, Apellido, Contrasena) VALUES (%s, %s, %s, %s)",
                      (Email,Nombre, Apellido, contrasena))
        db.commit()
        return jsonify({'message': 'Usuario registrado correctamente'}), 201
    except mysql.connector.Error as err:
        print("Error al registrar usuario:", err)
        return jsonify({'message': 'Error al registrar usuario'}), 500
    finally:
        cursor.close()

@app.route('/api/consulta', methods=['POST'])
def consul():
    data = request.json

    print(data)

    instrumento = data.get('instrumento')
    grado_escolar = data.get('Grado_Escolar')
    materia = data.get('Materia')
    numero_aspectos = data.get('Numero_Aspectos')
    numero_criterios = data.get('Numero_Criterios')
    aspectos_evaluar = data.get('Aspectos_Evaluar')

    genai.configure(api_key="AIzaSyBnkxDdxiQN-Ovbaru0UOIEF--NzeEY4X8")

    # Set up the model
    generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 0,
      "max_output_tokens": 8192,
    }

    safety_settings = [
    {
      "category": "HARM_CATEGORY_HARASSMENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_HATE_SPEECH",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
      "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
  ]
    
    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

    convo = model.start_chat(history=[])
    
    if instrumento == 'rubrica':
        if numero_aspectos == '3':
            convo.send_message(f"Elabora criterios de evaluacion para una rubrica como si fueras un maestro de la materia: {materia}, con nivel escolar de:{grado_escolar}, La rubrica cuenta con:{numero_aspectos} aspectos (mal,regular,excelente). Ademas de contar con: {numero_criterios} Criterios de evaluacion Dividelo en partes por ejemplo separa los criterios y desarollalos para cada aspecto (mal, regular, excelente) no pongas calificacion numerica a los resultados solo con las palabras (mal,regular,excelente) es suficiente Ademas solo necesito que devuelvas los criterios a evaluar y ningun dato de mas solo lo necesario y manten este forma de mostrarlo sin importar el numero de criterios **Criterio 1: Nombre del criterio: **, Los criterios de evaluacion seran en base al siguiente texto y tema a evaluar: {aspectos_evaluar}")
        elif numero_aspectos == '4':
            convo.send_message(f"Elabora criterios de evaluacion para una rubrica como si fueras un maestro de la materia: {materia}, con nivel escolar de:{grado_escolar}, La rubrica cuenta con:{numero_aspectos} aspectos (mal,regular,bien,excelente). Ademas de contar con: {numero_criterios} Criterios de evaluacion Dividelo en partes por ejemplo separa los criterios y desarollalos para cada aspecto (mal, regular,bien, excelente) no pongas calificacion numerica a los resultados solo con las palabras (mal,regular,bien,excelente) es suficiente Ademas solo necesito que devuelvas los criterios a evaluar y ningun dato de mas solo lo necesario y manten este forma de mostrarlo sin importar el numero de criterios **Criterio 1: Nombre del criterio: **, Los criterios de evaluacion seran en base al siguiente texto y tema a evaluar: {aspectos_evaluar}")
    elif instrumento == 'lista de cotejo':
        convo.send_message(f"Elabora criterios de evaluacion para una lista de cotejo como si fueras un maestro de la materia: {materia}, con nivel escolar de:{grado_escolar}, La lista de cotejo cuenta con: {numero_criterios} Criterios de evaluacion Dividelo en partes por ejemplo separa los criterios y desarollalos no pongas calificacion numerica a los resultados. solo necesito que devuelvas los criterios a evaluar y ningun dato de mas solo lo necesario y manten este forma de mostrarlo sin importar el numero de criterios **Criterio 1: Nombre del criterio: ** y **Descripcion**, Los criterios de evaluacion seran en base al siguiente texto y tema a evaluar: {aspectos_evaluar}")

    print(convo.last.text)
    return jsonify( convo.last.text )

# Ruta para el inicio de sesión de usuarios
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json

    # Obtener los datos del formulario
    Email = data.get('Email')
    contrasena = data.get('contrasena')

    # Verificar las credenciales en la base de datos
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM usuario WHERE Email = %s AND Contrasena = %s", (Email, contrasena))
        user = cursor.fetchone()
        cursor.close()  # Cerrar el cursor después de recuperar los resultados
        if user:
            return jsonify({'message': 'Inicio de sesión exitoso'}), 200
        else:
            return jsonify({'message': 'Credenciales incorrectas'}), 401
    except mysql.connector.Error as err:
        print("Error al iniciar sesión:", err)
        return jsonify({'message': 'Error al iniciar sesión'}), 500

@app.route('/api/historial', methods=['POST'])
def historial():
    
    data = request.json

    instrumento = data.get('instrumento')
    grado_escolar = data.get('Grado_Escolar')
    materia = data.get('Materia')
    numero_aspectos = data.get('Numero_Aspectos')
    numero_criterios = data.get('Numero_Criterios')
    aspectos_evaluar = data.get('Aspectos_Evaluar')
    email = data.get('email')

    print(data)

    # Insertar el usuario en la base de datos
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO historial (GradoEscolar, Materia, Cant_Aspecto, Cant_Criterios, Aspectos_Evaluar, Instrumento, PromptUtilizado, PromptGenerado, RutaArchivo, email) VALUES (%s, %s, %s, %s,%s, %s, %s,%s, %s, %s)",
                    (grado_escolar, materia, numero_aspectos, numero_criterios, aspectos_evaluar, instrumento,"","","", email))
        db.commit()
        return jsonify({'message': 'Datos ingresados correctamente'}), 201
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({'message': 'Error al registrar la informacion'}), 500
    finally:
        cursor.close()
        
@app.route('/api/datoshistorial', methods=['POST'])
def DatosHistorial():
    data = request.json

    Email = data.get('Email')  # Cambiar 'Email' a 'email'

    # Insertar el usuario en la base de datos
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM Historial WHERE email = %s", (Email,))
        results = cursor.fetchall()  # Obtener todos los resultados de la consulta
        db.commit()
        return jsonify({'message': 'Consulta exitosa', 'results': results}), 200
    except mysql.connector.Error as err:
        print("Error al realizar la consulta:", err)
        return jsonify({'message': 'Error al realizar la consulta'}), 500
    finally:
        cursor.close()

@app.route('/api/datoshistorialAspectos', methods=['POST'])
def DatosHistorialAspectos():
    data = request.json

    Aspectos = data.get('Aspectos')  # Cambiar 'Email' a 'email'

    # Insertar el usuario en la base de datos
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM Historial WHERE Aspectos_Evaluar = %s", (Aspectos,))
        results = cursor.fetchall()  # Obtener todos los resultados de la consulta
        db.commit()
        return jsonify({'message': 'Consulta exitosa', 'results': results}), 200
    except mysql.connector.Error as err:
        print("Error al realizar la consulta:", err)
        return jsonify({'message': 'Error al realizar la consulta'}), 500
    finally:
        cursor.close()

if __name__ == '__main__':
    app.run(debug=True)