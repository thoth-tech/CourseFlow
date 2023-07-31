import { Injectable } from '@angular/core';
import { DiscoveryNodeData, DiscoveryLinkData, DiscoveryColorData} from './discoveryInterfaces';

@Injectable({
  providedIn: 'root'
})
export class DiscoveryService {

  // Mock data
  discoveryNodesData : DiscoveryNodeData[] = [
    {id: "IT", name: "IT", group: 0, nodeLabelType: "Field"},
    {id: "Application Development", name: "Application Development", group: 1, nodeLabelType: "Field"},
    {id: "SIT232", name: "Object-Oriented Development", group: 2, nodeLabelType: "Unit"},
    {id: "SIT305", name: "Mobile Application Development", group: 2, nodeLabelType: "Unit"},
    {id: "SIT313", name: "Full Stack Development: Secure Frontend Applications", group: 2, nodeLabelType: "Unit"},
    {id: "SIT331", name: "Full Stack Development: Secure Backend Services", group: 2, nodeLabelType: "Unit"},
    {id: "SIT323", name: "Cloud Native Application Development", group: 2, nodeLabelType: "Unit"},
    {id: "Game Development", name: "Game Development", group: 1, nodeLabelType: "Field"},
    {id: "SIT151", name: "Game Fundamentals", group: 2, nodeLabelType: "Unit"},
    {id: "SIT253", name: "Content Creation for Interactive Experiences", group: 2, nodeLabelType: "Unit"},
    {id: "SIT254", name: "Game Design", group: 2, nodeLabelType: "Unit"},
    {id: "SIT283", name: "Development for Virtual and Augmented Reality", group: 2, nodeLabelType: "Unit"},
    {id: "Cyber Security", name: "Cyber Security", group: 1, nodeLabelType: "Field"},
    {id: "SIT192", name: "Discrete Mathematics", group: 2, nodeLabelType: "Unit"},
    {id: "SIT202", name: "Computer Networks and Communication", group: 2, nodeLabelType: "Unit"},
    {id: "SIT327", name: "Network Forensics", group: 2, nodeLabelType: "Unit"},
    {id: "SIT379", name: "Ethical Hacking", group: 2, nodeLabelType: "Unit"},
    {id: "Science", name: "Science", group: 0, nodeLabelType: "Field"},
    {id: "Cell Biology and Genomics", name: "Cell Biology and Genomics", group: 1, nodeLabelType: "Field"},
    {id: "SLE212", name: "Biochemistry", group: 2, nodeLabelType: "Unit"},
    {id: "SLE254", name: "Genetics and Genomics", group: 2, nodeLabelType: "Unit"},
    {id: "HMM202", name: "Molecular Diagnostics", group: 2, nodeLabelType: "Unit"},
    {id: "SLE357", name: "Advanced Cell Biology", group: 2, nodeLabelType: "Unit"},
    {id: "SLE339", name: "Human Genetics and Genomics", group: 2, nodeLabelType: "Unit"},
    {id: "SLE340", name: "Genomes and Bioinformatics", group: 2, nodeLabelType: "Unit"},
    {id: "Chemistry", name: "Chemistry", group: 1, nodeLabelType: "Field"},
    {id: "SLE210", name: "Chemistry the Enabling Science", group: 2, nodeLabelType: "Unit"},
    {id: "SLE214", name: "Organic Chemistry", group: 2, nodeLabelType: "Unit"},
  ]

  discoveryLinksData : DiscoveryLinkData[] = [
    {source: "IT", target: "Game Development", lineLabelType: "Field"},
    {source: "IT", target: "Application Development", lineLabelType: "Field"},
    {source: "IT", target: "Cyber Security", lineLabelType: "Field"},
    {source: "SIT232", target: "Application Development", lineLabelType: "Unit"},
    {source: "SIT305", target: "Application Development", lineLabelType: "Unit"},
    {source: "SIT313", target: "Application Development", lineLabelType: "Unit"},
    {source: "SIT323", target: "Application Development", lineLabelType: "Unit"},
    {source: "SIT323", target: "SIT331", lineLabelType: "Unit"},
    {source: "SIT151", target: "Game Development", lineLabelType: "Unit"},
    {source: "SIT253", target: "Game Development", lineLabelType: "Unit"},
    {source: "SIT254", target: "Game Development", lineLabelType: "Unit"},
    {source: "SIT283", target: "Game Development", lineLabelType: "Unit"},
    {source: "SIT192", target: "Cyber Security", lineLabelType: "Unit"},
    {source: "SIT202", target: "Cyber Security", lineLabelType: "Unit"},
    {source: "SIT327", target: "Cyber Security", lineLabelType: "Unit"},
    {source: "SIT379", target: "Cyber Security", lineLabelType: "Unit"},
    {source: "Science", target: "Cell Biology and Genomics", lineLabelType: "Field"},
    {source: "Science", target: "Chemistry", lineLabelType: "Field"},
    {source: "SLE212", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "SLE254", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "HMM202", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "SLE357", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "SLE339", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "SLE340", target: "Cell Biology and Genomics", lineLabelType: "Unit"},
    {source: "SLE210", target: "Chemistry", lineLabelType: "Unit"},
    {source: "SLE214", target: "Chemistry", lineLabelType: "Unit"},
  ]

  colorMapping : DiscoveryColorData = {
    0: "#1d192b",
    1: "#484458",
    2: "#e8def8",
  }

  constructor() { }

  getAllDiscoveryNodeData(): DiscoveryNodeData[] {
    return this.discoveryNodesData;
  }
  
  getAllDiscoveryLinkData(): DiscoveryLinkData[] {
    return this.discoveryLinksData;
  }
}
