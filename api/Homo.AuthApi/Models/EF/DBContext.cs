using System;
using System.Data;
using System.Data.Common;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Homo.AuthApi
{
    public partial class DBContext : DbContext
    {
        public DBContext() { }

        public DBContext(DbContextOptions<DBContext> options) : base(options) { }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<VerifyCode> VerifyCode { get; set; }
        public virtual DbSet<RelationOfGroupAndUser> RelationOfGroupAndUser { get; set; }
        public virtual DbSet<Group> Group { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);


    }
}