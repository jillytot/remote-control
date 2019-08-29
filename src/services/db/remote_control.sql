CREATE DATABASE remote_control
    WITH 
    OWNER = "postgres"
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

SET default_tablespace
= '';

SET default_with_oids
= false;

CREATE SCHEMA public
    AUTHORIZATION postgres;

COMMENT ON SCHEMA public
    IS 'standard public schema';

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;
--
-- TOC entry 200 (class 1259 OID 16426)
-- Name: channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users
(

    username character varying(25) COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    id character varying COLLATE pg_catalog."default" NOT NULL,
    created bigint,
    type character varying[] COLLATE pg_catalog."default",
    session character varying COLLATE pg_catalog."default",
    status jsonb,
    settings jsonb,
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

CREATE TABLE public.chat_rooms
(
    name character varying COLLATE pg_catalog."default",
    id character varying COLLATE pg_catalog."default" NOT NULL,
    host_id character varying COLLATE pg_catalog."default",
    messages character varying[] COLLATE pg_catalog."default",
    created character varying COLLATE pg_catalog."default",
    CONSTRAINT chat_rooms_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.chat_rooms
    OWNER to postgres;

CREATE TABLE public.channels
(
    host_id character varying COLLATE pg_catalog."default",
    id character varying COLLATE pg_catalog."default" NOT NULL,
    name character varying COLLATE pg_catalog."default",
    chat character varying COLLATE pg_catalog."default",
    display character varying COLLATE pg_catalog."default",
    created character varying COLLATE pg_catalog."default",
    status jsonb,
    settings jsonb,
    robot character varying COLLATE pg_catalog."default",
    controls character varying COLLATE pg_catalog."default",
    CONSTRAINT channels_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.channels
    OWNER to postgres;

CREATE TABLE public.robots
(
    name character varying COLLATE pg_catalog."default",
    id character varying COLLATE pg_catalog."default" NOT NULL,
    owner_id character varying COLLATE pg_catalog."default",
    interfaces character varying[] COLLATE pg_catalog."default",
    session character varying COLLATE pg_catalog."default",
    created bigint,
    status jsonb,
    settings jsonb,
    host_id character varying COLLATE pg_catalog."default",
    CONSTRAINT robots_pkey PRIMARY KEY (id)
)

WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.robots
    OWNER to postgres;

CREATE TABLE public.controls
(
     id character varying COLLATE pg_catalog."default" NOT NULL,
    channel_id character varying COLLATE pg_catalog."default",
    buttons jsonb[],
    created character varying COLLATE pg_catalog."default",
    settings jsonb,
    status jsonb,
    CONSTRAINT controls_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.controls
    OWNER to postgres;


CREATE TABLE public.robot_servers
(
    owner_id character varying COLLATE pg_catalog."default",
    server_id character varying COLLATE pg_catalog."default" NOT NULL,
    server_name character varying COLLATE pg_catalog."default",
    created character varying COLLATE pg_catalog."default",
    settings jsonb,
    status jsonb,
    channels jsonb[],
    CONSTRAINT "robotServers_pkey" PRIMARY KEY (server_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.robot_servers
    OWNER to postgres;



CREATE TABLE public.invites
(
    id character varying COLLATE pg_catalog."default" NOT NULL,
    created_by character varying COLLATE pg_catalog."default",
    server_id character varying COLLATE pg_catalog."default",
    created character varying COLLATE pg_catalog."default",
    expires character varying COLLATE pg_catalog."default" NOT NULL,
    status character varying COLLATE pg_catalog."default",
    CONSTRAINT invites_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.invites
    OWNER to postgres;


CREATE TABLE public.members
(
    server_id character varying COLLATE pg_catalog."default" NOT NULL,
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    roles character varying[] COLLATE pg_catalog."default",
    status jsonb,
    settings jsonb[],
    joined character varying COLLATE pg_catalog."default",
    invites character varying[] COLLATE pg_catalog."default",
    CONSTRAINT member_pkey PRIMARY KEY (user_id, server_id),
    CONSTRAINT server_pkey FOREIGN KEY (server_id)
        REFERENCES public.robot_servers (server_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT user_pkey FOREIGN KEY (server_id)
        REFERENCES public.robot_servers (server_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.members
    OWNER to postgres;


CREATE TABLE public.chat_messages
(
    message character varying COLLATE pg_catalog."default",
    sender character varying COLLATE pg_catalog."default",
    sender_id character varying COLLATE pg_catalog."default",
    chat_id character varying COLLATE pg_catalog."default",
    server_id character varying COLLATE pg_catalog."default",
    id character varying COLLATE pg_catalog."default" NOT NULL,
    time_stamp character varying COLLATE pg_catalog."default",
    broadcast character varying COLLATE pg_catalog."default",
    display_message boolean,
    badges character varying[] COLLATE pg_catalog."default",
    type character varying COLLATE pg_catalog."default",
    CONSTRAINT chat_messages_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.chat_messages
    OWNER to postgres;

    CREATE TABLE public.generated_keys
(
    key_id character varying COLLATE pg_catalog."default" NOT NULL,
    created character varying COLLATE pg_catalog."default",
    expires character varying COLLATE pg_catalog."default",
    ref character varying COLLATE pg_catalog."default",
    expired character varying COLLATE pg_catalog."default",
    CONSTRAINT generated_keys_pkey PRIMARY KEY (key_id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.generated_keys
    OWNER to postgres;
