import React, { useEffect, useContext } from "react";

import { Container } from "semantic-ui-react";
import ActivityStore from "./stores/activityStore";
import NavBar from "./features/nav/NavBar";
import ActivityDashboard from "./features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./layout/LoadingComponent";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading activities" />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default App;
