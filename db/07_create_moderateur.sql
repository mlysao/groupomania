-- moderateur de test: moderateur@groupomania.fr/123456789
insert into utilisateur(id, email, email_display, password, role, "createdAt", "updatedAt") values (1, 'moderateur@groupomania.fr', 'mod*******@************fr', '$2b$10$rZMg9SKcM2.KXMbOyGwbrOTSZTzljyrQ0sfjxrpBv8tNoqsfRt4/6', 'MODERATEUR', now(), now());
ALTER SEQUENCE IF EXISTS utilisateur_id_seq RESTART WITH 2;
