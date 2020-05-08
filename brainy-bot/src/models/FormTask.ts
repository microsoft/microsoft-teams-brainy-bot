export class FormTask {
  constructor(
    customer: string,
    length: string,
    name: string,
    type: string,
    url: string,
    goal: string,
    requiredSkills: string,
    ownerUpn: string
  ) {
    this.customer = customer;
    this.length = length;
    this.name = name;
    this.type = type;
    this.url = url;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.ownerUpn = ownerUpn;
  }
  customer: string;
  length: string;
  name: string;
  type: string;
  url: string;
  goal: string;
  requiredSkills: string;
  ownerUpn: string;
}
