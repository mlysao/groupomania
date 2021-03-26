CREATE SEQUENCE publication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE publication_id_seq OWNER TO groupomania;

CREATE TABLE publication (
    id bigint NOT NULL DEFAULT nextval('publication_id_seq'::regclass),
	description character varying(255) NOT NULL,
    image_url character varying(255) NOT NULL,
	utilisateur_id bigint NOT NULL,
	date_publication TIMESTAMP WITH TIME ZONE NOT NULL,
	modere boolean  DEFAULT false NOT NULL,
	"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);


ALTER TABLE publication OWNER TO groupomania;

ALTER SEQUENCE publication_id_seq OWNED BY publication.id;

ALTER TABLE ONLY publication
    ADD CONSTRAINT publication_pkey PRIMARY KEY (id);

ALTER TABLE ONLY publication
    ADD CONSTRAINT publication_utilisateur_fk FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id);
