CREATE TABLE likes (
  publication_id BIGINT NOT NULL,
  utilisateur_id BIGINT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE (publication_id, utilisateur_id),
  PRIMARY KEY (publication_id, utilisateur_id),
  CONSTRAINT likes_publication_fk FOREIGN KEY (publication_id)
      REFERENCES publication(id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT likes_utilisateur_id FOREIGN KEY (utilisateur_id)
      REFERENCES utilisateur(id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE
);

ALTER TABLE likes OWNER TO groupomania;
