export interface IConflictResolutionStrategy {
  resolve(local: any, remote: any, metadata?: any): any;
}
