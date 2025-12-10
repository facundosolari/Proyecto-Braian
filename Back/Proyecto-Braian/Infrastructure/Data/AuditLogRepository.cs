using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly DataBaseContext _databaseContext;

        public AuditLogRepository(DataBaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public void Log(int userId, string action, string? details = null)
        {
            var log = new AuditLog { UserId = userId, Action = action, Details = details };
            _databaseContext.AuditLogs.Add(log);
            _databaseContext.SaveChanges();
        }
    }
}

