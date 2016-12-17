--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


SET search_path = public;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: answers; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE answers (
    sessionid integer NOT NULL,
    participantid integer NOT NULL,
    answer integer,
    questionnumber integer NOT NULL
);


ALTER TABLE answers OWNER TO mars;

--
-- Name: participants; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE participants (
    id integer NOT NULL,
    nickname character varying(50),
    sessionid integer
);


ALTER TABLE participants OWNER TO mars;

--
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: mars
--

CREATE SEQUENCE participants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE participants_id_seq OWNER TO mars;

--
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mars
--

ALTER SEQUENCE participants_id_seq OWNED BY participants.id;


--
-- Name: polls; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE polls (
    name character varying(100),
    id integer NOT NULL,
    type character varying(20),
    authorid integer DEFAULT 0
);


ALTER TABLE polls OWNER TO mars;

--
-- Name: polls_id_seq; Type: SEQUENCE; Schema: public; Owner: mars
--

CREATE SEQUENCE polls_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE polls_id_seq OWNER TO mars;

--
-- Name: polls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mars
--

ALTER SEQUENCE polls_id_seq OWNED BY polls.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE questions (
    id integer NOT NULL,
    text character(1000),
    nbchoices integer,
    correctanswer integer,
    pollid integer,
    number integer DEFAULT 1 NOT NULL
);


ALTER TABLE questions OWNER TO mars;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: mars
--

CREATE SEQUENCE questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_id_seq OWNER TO mars;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mars
--

ALTER SEQUENCE questions_id_seq OWNED BY questions.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE sessions (
    id integer NOT NULL,
    pollid integer,
    status character varying(20) DEFAULT 'idle'::character varying,
    secret integer,
    mode character varying(15),
    questionnumber integer,
    launcherid integer DEFAULT 0 NOT NULL,
    authorid integer DEFAULT 0 NOT NULL,
    datestart bigint DEFAULT 0
);


ALTER TABLE sessions OWNER TO mars;

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: mars
--

CREATE SEQUENCE sessions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE sessions_id_seq OWNER TO mars;

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mars
--

ALTER SEQUENCE sessions_id_seq OWNED BY sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: mars
--

CREATE TABLE users (
    id integer NOT NULL,
    name character varying(50) DEFAULT ''::character varying,
    firstname character varying(50) DEFAULT ''::character varying,
    email character varying(60) DEFAULT ''::character varying,
    passwordsha256 character varying(100) DEFAULT ''::character varying,
    nickname character varying(50) DEFAULT ''::character varying,
    isadmin boolean DEFAULT false,
    isapproved boolean DEFAULT false
);


ALTER TABLE users OWNER TO mars;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: mars
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO mars;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: mars
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: mars
--

ALTER TABLE ONLY participants ALTER COLUMN id SET DEFAULT nextval('participants_id_seq'::regclass);


--
-- Name: polls id; Type: DEFAULT; Schema: public; Owner: mars
--

ALTER TABLE ONLY polls ALTER COLUMN id SET DEFAULT nextval('polls_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: mars
--

ALTER TABLE ONLY questions ALTER COLUMN id SET DEFAULT nextval('questions_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: mars
--

ALTER TABLE ONLY sessions ALTER COLUMN id SET DEFAULT nextval('sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: mars
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: mars
--

ALTER TABLE ONLY participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: polls polls_pkey; Type: CONSTRAINT; Schema: public; Owner: mars
--

ALTER TABLE ONLY polls
    ADD CONSTRAINT polls_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: mars
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: mars
--

ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: mars
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

-- INITIALIZE FIRST USER

INSERT INTO users (name, firstname, nickname, email, passwordsha256, isadmin, isapproved) VALUES ('admin', 'admin', 'admin', 'admin@nodomain.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 't', 't');
