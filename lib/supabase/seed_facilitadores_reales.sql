-- ============================================
-- FACILITADORES REALES - Mar del Plata
-- Datos parciales - completar info faltante
-- ============================================

-- Primero, necesitamos actividades existentes para vincular
-- Asumimos que las actividades del schema.sql ya están cargadas

-- ============================================
-- INSERTAR FACILITADORES
-- ============================================

INSERT INTO facilitadores (nombre, email, telefono, whatsapp, bio, ciudad, latitud, longitud, direccion, instagram, activo) VALUES

-- 1. Club de Almas al Servicio
('Club de Almas al Servicio', 'contacto@clubdealmas.com', NULL, NULL,
'Espacio holístico de sanación y encuentro espiritual.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@clubdealmas.alservicio', true),

-- 2. Terapias Sanadoras MG
('Terapias Sanadoras MG', 'terapiassanadorasmg@gmail.com', NULL, NULL,
'Espacio de terapias sanadoras y acompañamiento energético.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@terapiassanadorasmg', true),

-- 3. Marie Aromaterapia
('Marie Aromaterapia', 'marie.aromaterapia@gmail.com', NULL, NULL,
'Espacio de aromaterapia natural y bienestar.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@marie_aromaterapia', true),

-- 4. Reflejarte - Espacio Terapéutico
('Reflejarte', 'reflejarte.espacio@gmail.com', NULL, NULL,
'Espacio terapéutico integral para el bienestar emocional y energético.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@reflejarte.espacio.terapeutico', true),

-- 5. Orion Handpan - Donato Lacedonia
('Donato Lacedonia', 'donato.handpan@gmail.com', NULL, NULL,
'Músico y handpanista. Clases de handpan, meditación sonora y conciertos terapéuticos. Descubrí el poder sanador del handpan.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@orionhandpan', true),

-- 6. Bruno Hebe
('Bruno Hebe', 'brunohebe@gmail.com', NULL, NULL,
'Prácticas holísticas y bienestar integral.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@brunohebe', true),

-- 7. Andrea Amor al Mar
('Andrea Amor al Mar', 'amoralmar.mdq@gmail.com', '+542234240600', '+542234240600',
'Cosmética sustentable y vegana. Productos naturales para el cuidado personal y el bienestar.',
'Mar del Plata', -38.0055, -57.5426, 'Beruti 6851',
'@andrea_amor_al_mar', true),

-- 8. Maru Dominguez
('Maru Dominguez', 'maru.dominguez@gmail.com', NULL, NULL,
'Espacio de bienestar y crecimiento personal.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@maru_dominguez9', true),

-- 9. Holística Bienestar Integral
('Holística Bienestar Integral', 'holistica.bienestar@gmail.com', NULL, NULL,
'Centro de bienestar integral. Tratamientos naturales y alternativos para recuperar el equilibrio físico y emocional.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@holisticabienestarintegral', true),

-- 10. DevAmar Marina - Marina Hicoff
('Marina Hicoff - DevAmar', 'devmar.71@gmail.com', NULL, NULL,
'Sonidos para el alma. Meditación, conciertos grupales, masaje sonoro, Reiki y Diksha. Cuencos tibetanos afinados en La 432.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@devamarmarina', true),

-- 11. María Paula Caldararo
('María Paula Caldararo', 'mariapaula.caldararo@gmail.com', NULL, NULL,
'Profesional de la salud con enfoque holístico.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@mariapaulacaldararo', true),

-- 12. Mario Godas
('Mario Godas', 'mario.godas@gmail.com', NULL, NULL,
'Artista y creador. Espacio de creatividad y bienestar.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@mario_godas', true),

-- 13. Clau A París
('Claudia París', 'clau.a.paris@gmail.com', NULL, NULL,
'Formación en terapias holísticas y acompañamiento.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@clau_a_paris', true),

-- 14. Jaqui Esencia Vital
('Jacqui - Esencia Vital', 'jaqui.esenciavital@gmail.com', NULL, NULL,
'Coach Floral, Aromaterapeuta y facilitadora de formaciones para mujeres. Terapias florales y bienestar.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@jaqui.esenciavital', true),

-- 15. Valeria Altrui
('Valeria Altrui', 'valeria.altrui@gmail.com', NULL, NULL,
'Espacio de terapias holísticas y bienestar.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@valeria_altrui', true),

-- 16. Elisabet Pipi
('Elisabet Pipi', 'elisabet.pipi@gmail.com', NULL, NULL,
'Prácticas holísticas y desarrollo personal.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@elisabetpipi', true),

-- 17. Ruhollah MDP
('Ruhollah', 'ruhollah.mdp@gmail.com', NULL, NULL,
'Espacio de meditación y prácticas espirituales.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@ruhollahmdp', true),

-- 18. Rondas del Alma
('Rondas del Alma', 'rondasdelalma@gmail.com', NULL, NULL,
'Encuentros de ronda, meditación y sanación grupal.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@rondasdelalma', true),

-- 19. Tai Chi Qigong Mar del Plata
('Tai Chi Qigong Mar del Plata', 'taichimardelplata@gmail.com', '+5492236883510', '+5492236883510',
'Escuela Ma Tsun Kuen de Tai Chi Chuan. Tai Chi, Qigong, Meditación, Manejo de Armas Chinas y Tiro con Arco Tradicional. Desde 1989.',
'Mar del Plata', -38.0055, -57.5426, 'Maipú 3527',
'@taichiqigongmardel', true),

-- 20. Alejandro Vergara Músico
('Alejandro Vergara', 'alejandro.vergara.musico@gmail.com', NULL, NULL,
'Músico, compositor y productor. Música para el bienestar y la meditación.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@alejandro.vergara.musico', true),

-- 21. Nathalia Zapata
('Nathalia Zapata', 'nathalia.zapata@gmail.com', NULL, NULL,
'Artista y cantante. Jazz, soul y música para el alma.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@nathaliazapata2212', true),

-- 22. Omar Soria - Armonización Sonora
('Omar Soria', 'omar.soria.armonizacion@gmail.com', NULL, NULL,
'Armonización sonora con cuencos, campanas y tambores. Terapias de sonido para el bienestar integral.',
'Mar del Plata', -38.0055, -57.5426, NULL,
'@omarsoria_armonizacionessonora', true);

-- ============================================
-- NOTAS PARA COMPLETAR:
-- ============================================
-- 1. Coordenadas: Todas usan -38.0055, -57.5426 (centro MDP)
--    Actualizar con coordenadas reales de cada ubicación
--
-- 2. Emails: Son genéricos - reemplazar por emails reales
--
-- 3. Direcciones: La mayoría está en NULL - completar
--
-- 4. WhatsApp/Teléfono: Solo algunos tienen - completar
--
-- 5. Bio: Algunas son genéricas - mejorar con info real del Instagram
--
-- Para buscar coordenadas reales:
-- https://nominatim.openstreetmap.org/search?q=DIRECCION+Mar+del+Plata&format=json
