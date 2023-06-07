export interface User {
    username: string,
    password: string
}

export interface Organization {
    bin: string,
    name: string,
    user?: string
}

export interface listOrg {
    count?: number,
    next: string,
    previous?: string,
    results: [Organization]
}