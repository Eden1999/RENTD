CREATE TABLE IF NOT EXISTS public.orders
(
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    workspace_id bigint NOT NULL,
    date timestamp with time zone NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;


-- Table: public.ratings

-- DROP TABLE IF EXISTS public.ratings;

CREATE TABLE IF NOT EXISTS public.ratings
(
    id bigint NOT NULL,
    workspace_id bigint NOT NULL,
    user_id bigint NOT NULL,
    rating numeric NOT NULL,
    comment character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ratings_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ratings
    OWNER to postgres;


-- Table: public.space_types

-- DROP TABLE IF EXISTS public.space_types;

CREATE TABLE IF NOT EXISTS public.space_types
(
    id bigint NOT NULL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT space_types_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.space_types
    OWNER to postgres;



-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id SERIAL,
    username character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL,
    is_host boolean NOT NULL,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;



-- Table: public.workspaces

-- DROP TABLE IF EXISTS public.workspaces;

CREATE TABLE IF NOT EXISTS public.workspaces
(
    id SERIAL,
    name character varying COLLATE pg_catalog."default" NOT NULL,
    host_id bigint NOT NULL,
    address character varying COLLATE pg_catalog."default" NOT NULL,
    location_x double precision NOT NULL,
    location_y double precision NOT NULL,
    cost_per_hour numeric NOT NULL DEFAULT 0,
    capacity numeric NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    wifi boolean,
    disabled_access boolean,
    space_type_id bigint NOT NULL,
    smoke_friendly boolean,
    CONSTRAINT workspace_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.availabilities
(
    id SERIAL,
    startDate timestamp,
    endDate timestamp,
    available boolean,
    workspace_id bigint,
    user_id bigint
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.workspaces
    OWNER to postgres;





-- Constraint: user_id

-- ALTER TABLE IF EXISTS public.orders DROP CONSTRAINT IF EXISTS user_id;

ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

-- Constraint: workspace_id

-- ALTER TABLE IF EXISTS public.orders DROP CONSTRAINT IF EXISTS workspace_id;

ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT workspace_id FOREIGN KEY (workspace_id)
    REFERENCES public.workspaces (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;


-- Constraint: user_id

-- ALTER TABLE IF EXISTS public.ratings DROP CONSTRAINT IF EXISTS user_id;

ALTER TABLE IF EXISTS public.ratings
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
-- Constraint: worspace_id

-- ALTER TABLE IF EXISTS public.ratings DROP CONSTRAINT IF EXISTS worspace_id;

ALTER TABLE IF EXISTS public.ratings
    ADD CONSTRAINT worspace_id FOREIGN KEY (workspace_id)
    REFERENCES public.workspaces (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;

-- Constraint: host_id

-- ALTER TABLE IF EXISTS public.workspaces DROP CONSTRAINT IF EXISTS host_id;

ALTER TABLE IF EXISTS public.workspaces
    ADD CONSTRAINT host_id FOREIGN KEY (host_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
-- Constraint: space_type_id

-- ALTER TABLE IF EXISTS public.workspaces DROP CONSTRAINT IF EXISTS space_type_id;

ALTER TABLE IF EXISTS public.workspaces
    ADD CONSTRAINT space_type_id FOREIGN KEY (space_type_id)
    REFERENCES public.space_types (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
