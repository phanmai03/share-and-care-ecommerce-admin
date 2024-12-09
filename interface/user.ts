export interface UserRole {
    id: string;
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

export interface ChangeData{
    oldPassword: string;
    newPassword: string;
}

export interface blockUser {
    id: string;  
    status: string;
}

//ROLE//
export interface RoleResponse{
    id: string;  
    role: Role;
}

export interface Role{
    id: string;  
    name: string;
}



