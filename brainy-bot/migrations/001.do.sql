/****** Object:  Table [dbo].[action] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[action]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[typeid] [int] NOT NULL,
	[taskid] [int] NOT NULL,
	[useraadobjectid] [nvarchar](250) NOT NULL,
	[comment] [nvarchar](1500) NULL,
	[created] [datetime] NOT NULL,
	CONSTRAINT [PK_action] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[action_type] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[action_type]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
	CONSTRAINT [PK_action_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assignment] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assignment]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[useraadobjectid] [nvarchar](250) NOT NULL,
	[taskid] [int] NOT NULL,
	[manageraadobjectid] [nvarchar](250) NOT NULL,
	[actionid] [int] NOT NULL,
	[created] [datetime] NOT NULL,
	CONSTRAINT [PK_assignment] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[feedback] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[feedback]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[taskid] [int] NOT NULL,
	[useraadobjectid] [nvarchar](250) NOT NULL,
	[comment] [nvarchar](1500) NULL,
	[rating] [int] NULL,
	[created] [datetime] NOT NULL,
	CONSTRAINT [PK_feedback] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[membership] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[membership]
(
	[useraadobjectid] [nvarchar](250) NOT NULL,
	[typeid] [int] NOT NULL,
	CONSTRAINT [PK_membership] PRIMARY KEY CLUSTERED 
(
	[useraadobjectid] ASC,
	[typeid] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[membership_type] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[membership_type]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](500) NOT NULL,
	CONSTRAINT [PK_membership_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
)
GO
/****** Object:  Table [dbo].[manager_team] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[manager_team]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[teamid] [nvarchar](500) NOT NULL
		CONSTRAINT [PK_manager_team] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[task] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[task]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[customer] [nvarchar](200) NOT NULL,
	[name] [nvarchar](200) NOT NULL,
	[type] [nvarchar](200) NOT NULL,
	[length] [nvarchar](1500) NOT NULL,
	[url] [nvarchar](500) NOT NULL,
	[goal] [nvarchar](200) NOT NULL,
	[requiredskills] [nvarchar](1000) NOT NULL,
	[statusid] [int] NOT NULL,
	[owneraadobjectid] [nvarchar](250) NOT NULL,
	[created] [datetime] NOT NULL,
	[conversationreference] [nvarchar](max) NULL,
	CONSTRAINT [PK_engagement] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[task_status] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[task_status]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NULL,
	CONSTRAINT [PK_task_status] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[user] ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user]
(
	[aadobjectid] [nvarchar](500) NOT NULL,
	[name] [nvarchar](500) NOT NULL,
	[givenname] [nvarchar](500) NOT NULL,
	[conversationreference] [nvarchar](max) NOT NULL,
	[availability] [bit] NOT NULL,
	CONSTRAINT [PK_user_1] PRIMARY KEY CLUSTERED 
(
	[aadobjectid] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

/****** Inserting default data *****/
SET IDENTITY_INSERT [dbo].[action_type] ON
INSERT [dbo].[action_type]
	([id], [name])
VALUES
	(1, N'declinedtask')
INSERT [dbo].[action_type]
	([id], [name])
VALUES
	(2, N'assignedspecialist')
INSERT [dbo].[action_type]
	([id], [name])
VALUES
	(3, N'acceptedtask')
SET IDENTITY_INSERT [dbo].[action_type] OFF

SET IDENTITY_INSERT [dbo].[membership_type] ON
INSERT [dbo].[membership_type]
	([id], [name])
VALUES
	(1, N'manager')
INSERT [dbo].[membership_type]
	([id], [name])
VALUES
	(2, N'specialist')
SET IDENTITY_INSERT [dbo].[membership_type] OFF

SET IDENTITY_INSERT [dbo].[task_status] ON
INSERT [dbo].[task_status]
	([id], [name])
VALUES
	(1, N'pendingmanager')
INSERT [dbo].[task_status]
	([id], [name])
VALUES
	(2, N'declinedmanager')
INSERT [dbo].[task_status]
	([id], [name])
VALUES
	(3, N'pendingspecialist')
INSERT [dbo].[task_status]
	([id], [name])
VALUES
	(4, N'accepted')
SET IDENTITY_INSERT [dbo].[task_status] OFF