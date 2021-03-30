CREATE SEQUENCE utilisateur_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE utilisateur_id_seq OWNER TO groupomania;

CREATE TABLE utilisateur (
    id bigint NOT NULL DEFAULT nextval('utilisateur_id_seq'::regclass),
    email character varying(255) NOT NULL,
    email_display character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
	role character varying(255) NOT NULL,
	image_url character varying(255),
	"createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
	"updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL	
);


ALTER TABLE utilisateur OWNER TO groupomania;

ALTER SEQUENCE utilisateur_id_seq OWNED BY utilisateur.id;

ALTER TABLE ONLY utilisateur
    ADD CONSTRAINT utilisateur_pkey PRIMARY KEY (id);

ALTER TABLE ONLY utilisateur
    ADD CONSTRAINT utilisateur_email_uk UNIQUE (email);	
