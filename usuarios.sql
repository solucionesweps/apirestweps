CREATE TABLE usuario (id SERIAL PRIMARY KEY,
  cedula_identidad VARCHAR(20) PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  primer_apellido VARCHAR(50) NOT NULL,
  segundo_apellido VARCHAR(50),
  fecha_nacimiento DATE NOT NULL
);