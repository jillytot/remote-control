import React from "react";

const PrivacyPolicy = formatModal => {
  return (
    <React.Fragment>
      <PrivacyPolicyText formatModal={formatModal} />
    </React.Fragment>
  );
};

export default PrivacyPolicy;

const PrivacyPolicyText = formatModal => {
  return (
    <div className={formatModal === true ? "" : "tos-text-container"}>
      <div className="tos-text">
        Remo.TV is a privately owned and operated experimental web platform for
        providing telepresence experiences. While we will take steps to secure
        user information as much as possible, it's still up to you to assume the
        risk of providing us any data.
        <br />
        <br />
        All information provided to the Remo.TV platform is for internal use
        only. We will not sell or distribute the personal & private information
        of any user provided to the site for any reason. We may choose to use
        public content you create for promotional purposes only, however we
        claim no exclusive rights to your content.
      </div>
    </div>
  );
};
