-- moderateur de test: moderateur@groupomania.fr/123456789
insert into utilisateur(id, email, email_display, password, role, "createdAt", "updatedAt", image_url) values (1, 'moderateur@groupomania.fr', 'mod*******@************fr', '$2b$10$P4RPACn1718gok/Eb4WwWOVSMqfsDSQTd3V2ERK1cJeNS/5436He6', 'MODERATEUR', now(), now(), 'http://localhost:3000/images/grouporama.png');
ALTER SEQUENCE IF EXISTS utilisateur_id_seq RESTART WITH 2;
