import React from "react";
import "./frontPage.css";

const TOS = formatModal => {
  return (
    <React.Fragment>
      <TosText formatModal={formatModal} />
    </React.Fragment>
  );
};

export default TOS;

const TosText = formatModal => {
  return (
    <div className={formatModal === true ? "" : "tos-text-container"}>
      <div className="tos-text">
        Remo is a privately owned and operated web application for interactive
        telepresence experiences. This platform is open for anyone to
        experiement with and use, provided you follow a few basic rules. While
        following the rules and guidelines, it is still up to the owner's
        descretion on who or who may not use the site, and your membership may
        be terminated at any time for any reason.
        <br />
        <br />
        1. Do no harm, and be kind. Hate speech such as racist, mysognistic, or
        anti-lgbt language will not be tollerated, and will likely & immediately
        result in a global ban.
        <br /> <br />
        2. No sexually explicit, violent, or other law breaking behavior such as
        illegal drug use is not allowed.
        <br /> <br />
        3. Do not intentionally try to cause harm to anyone's robots or
        property. Broadcasters who make their robots publicly available usually
        have rules posted that need to be followed. If you aren't sure, ask!
        <br /> <br />
        4. Do not cause any harm to people & animals.
        <br /> <br />
        5. This is not a spy cam website. Any video streams that appear to
        violiate the privacy of others will be quickly shutdown.
        <br /> <br />
        6. No Trolling. While you may not explicitly be breaking any rules, if
        we determine you are acting with the intent to cause harm, you will be
        removed.
        <br /> <br />
        7. Explicit language & cursing is not allowed on publicly listed servers.
        Public servers must remain family friendly. Our intention is to make
        Remo as open, inclusive, safe, and as fun as possible. For the most
        part, we ask that you be polite, kind & considerate to the people who
        offer their robots for public use.
        <br />
        <br />
        8. Use at your own risk: Remo does not take responsibility for any
        hardware owned and operated by it's users or other parties. It is up to
        broadcasters to make sure they are not putting anyone in harms way.
        While we also appreciate donations & other contributions through
        platforms like Patreon, we cannot make any garuntees we will deliver on
        any expecations. All money exchanged through or for the platform is at
        the user's own risk. We will still do our best to honor any agreements
        or promises, so please contact jill@remo.tv for any issues you have.
      </div>
    </div>
  );
};
