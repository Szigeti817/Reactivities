import {
  observable,
  action,
  computed,
  makeObservable,
  makeAutoObservable,
  configure,
  runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../app/models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable loadingInitial = false;
  @observable selectedActivity: IActivity | undefined;
  @observable editMode = false;
  @observable submiting = false;
  @observable target = "";

  constructor() {
    //makeObservable(this);
    makeAutoObservable(this);
  }

  @computed get activitiesByDate() {
    //return this.activities
    //  .slice()
    //  .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          //this.activities.push(activity);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };
  @action createActivity = async (activity: IActivity) => {
    this.submiting = true;
    try {
      await agent.Activities.create(activity);
      //this.activities.push(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.editMode = false;
        this.submiting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submiting = false;
      });

      console.log(error);
    }
  };
  @action editActivity = async (activity: IActivity) => {
    this.submiting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submiting = false;
      });
    } catch (error) {
      runInAction(() => {
        this.submiting = false;
      });
      console.log(error);
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submiting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submiting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submiting = false;
        this.target = "";
      });
    }
  };

  @action openCreateForm = () => {
    this.editMode = true;
    this.selectedActivity = undefined;
  };

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  @action cancelFormOpen = () => {
    this.editMode = false;
  };
  @action selectActivity = (id: string) => {
    //this.selectedActivity = this.activities.find((a) => a.id === id);
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());
