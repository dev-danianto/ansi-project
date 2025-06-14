import React, { useEffect } from "react";

const VoteDashboard = () => {
  useEffect(() => {
    // Redirect to the external website when component mounts
    window.location.href = "https://vote-app-private-deploy.vercel.app/";
  }, []); // Empty dependency array ensures this runs once when component mounts

  // This div might be briefly visible before the redirect happens
  return <div>Redirecting to daniantopakpahan.my.id...</div>;
};

export default VoteDashboard;
