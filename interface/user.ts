export interface UserRole {
    name: string;
}

export interface UserData {
    id: string;      
    name: string;    
    email: string;   
    status: string;  
    role: UserRole;   
}

export interface UserDataResponse {
    users: UserData[];
}