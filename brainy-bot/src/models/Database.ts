export interface Task {
  id: number;
  customer: string;
  name: string;
  type: string;
  length: string;
  url: string;
  goal: string;
  requiredskills: string;
  statusid: number;
  owneraadobjectid: string;
  created: string;
  conversationreference: string;
}

export interface Action {
  id: number;
  typeid: number;
  taskid: number;
  useraadobjectid: string;
  comment: string;
  created: string;
}

export interface Assignment {
  id: number;
  useraadobjectid: string;
  taskid: number;
  manageraadobjectid: string;
  created: string;
  actionid: number;
}

export interface Feedback {
  id: number;
  taskid: number;
  useraadobjectid: string;
  comment: string;
  rating: number;
  created: string;
}

export interface ManagerTeam {
  id: number;
  teamid: string;
}

export interface Membership {
  useraadobjectid: string;
  typeid: number;
}

export interface User {
  aadobjectid: string;
  name: string;
  givenname: string;
  conversationreference: string;
  availability: boolean;
}
