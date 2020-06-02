export class FormTask {
  constructor(
    customer: string,
    length: string,
    name: string,
    type: string,
    url: string,
    goal: string,
    requiredSkills: string,
    ownerAadObjectId: string
  ) {
    this.customer = customer;
    this.length = length;
    this.name = name;
    this.type = type;
    this.url = url;
    this.goal = goal;
    this.requiredSkills = requiredSkills;
    this.ownerAadObjectId = ownerAadObjectId;
  }
  customer: string;
  length: string;
  name: string;
  type: string;
  url: string;
  goal: string;
  requiredSkills: string;
  ownerAadObjectId: string;
}
