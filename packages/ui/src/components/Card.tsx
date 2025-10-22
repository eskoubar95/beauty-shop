import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  const classes = `rounded-lg border bg-card text-card-foreground shadow-sm ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  const classes = `flex flex-col space-y-1.5 p-6 ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  const classes = `p-6 pt-0 ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
