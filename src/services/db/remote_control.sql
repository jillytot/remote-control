SET statement_timeout
= 0;
SET lock_timeout
= 0;
SET idle_in_transaction_session_timeout
= 0;
SET client_encoding
= 'UTF8';
SET standard_conforming_strings
= on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies
= false;
SET client_min_messages
= warning;
SET row_security
= off;

SET default_tablespace
= '';

SET default_with_oids
= false;

--
-- TOC entry 200 (class 1259 OID 16426)
-- Name: channels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.channels
(
    host_id character varying,
    id character varying NOT NULL,
    name character varying,
    chat character varying,
    controls character varying,
    display character varying,
    created character varying,
    access character varying
    []
);


    ALTER TABLE public.channels OWNER TO postgres;

    --
    -- TOC entry 199 (class 1259 OID 16420)
    -- Name: chat_rooms; Type: TABLE; Schema: public; Owner: postgres
    --

    CREATE TABLE public.chat_rooms
    (
        name character varying,
        id character varying,
        host_id character varying,
        messages character varying
        [],
    created character varying
);


        ALTER TABLE public.chat_rooms OWNER TO postgres;

        --
        -- TOC entry 198 (class 1259 OID 16412)
        -- Name: robot_servers; Type: TABLE; Schema: public; Owner: postgres
        --

        CREATE TABLE public.robot_servers
        (
            channels character varying
            [],
    owner_id character varying,
    server_id character varying NOT NULL,
    server_name character varying,
    users character varying[],
    created character varying
);


            ALTER TABLE public.robot_servers OWNER TO postgres;

            --
            -- TOC entry 196 (class 1259 OID 16387)
            -- Name: test; Type: TABLE; Schema: public; Owner: postgres
            --

            CREATE TABLE public.test
            (
                username character varying(25),
                password character varying,
                email character varying,
                id character varying,
                created bigint,
                type character varying
                []
);


                ALTER TABLE public.test OWNER TO postgres;

                --
                -- TOC entry 197 (class 1259 OID 16396)
                -- Name: users; Type: TABLE; Schema: public; Owner: postgres
                --

                CREATE TABLE public.users
                (
                    created integer,
                    email character varying(64),
                    id character varying(128) NOT NULL,
                    name character varying(32),
                    hash character varying(256),
                    "lastOnline" integer
                );


                ALTER TABLE public.users OWNER TO postgres;

