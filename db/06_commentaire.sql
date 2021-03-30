CREATE SEQUENCE commentaire_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE commentaire_id_seq OWNER TO groupomania;

CREATE TABLE commentaire (
    id bigint NOT NULL DEFAULT nextval('commentaire_id_seq'::regclass),
	contenu text NOT NULL,
	utilisateur_id bigint NOT NULL,
	publication_id bigint NOT NULL,
	date_publication TIMESTAMP WITH TIME ZONE NOT NULL,
	modere boolean  DEFAULT false NOT NULL,
	"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);


ALTER TABLE commentaire OWNER TO groupomania;

ALTER SEQUENCE commentaire_id_seq OWNED BY publication.id;

ALTER TABLE ONLY commentaire
    ADD CONSTRAINT commentaire_pkey PRIMARY KEY (id);

ALTER TABLE ONLY commentaire
    ADD CONSTRAINT commentaire_utilisateur_fk FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE;

ALTER TABLE ONLY commentaire
    ADD CONSTRAINT commentaire_publication_fk FOREIGN KEY (publication_id) REFERENCES publication(id) ON DELETE CASCADE;
