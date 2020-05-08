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
  ownerupn: string;
  created: string;
  conversationreference: string;
}

export interface Action {
  id: number;
  typeid: number;
  taskid: number;
  userupn: string;
  comment: string;
  created: string;
}

export interface Assignment {
  id: number;
  userupn: string;
  taskid: number;
  managerupn: string;
  created: string;
  actionid: number;
}

export interface Feedback {
  id: number;
  taskid: number;
  userupn: string;
  comment: string;
  rating: number;
  created: string;
}

export interface ManagerTeam {
  id: number;
  teamid: string;
}

export interface Membership {
  userupn: string;
  typeid: number;
}

export interface User {
  upn: string;
  aadobjectid: string;
  name: string;
  givenname: string;
  surname: string;
  emailaddress: string;
  conversationreference: string;
  availability: boolean;
}
