using System;
using System.Data;
using System.Data.Common;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Homo.IotApi
{
    public partial class IotDbContext : DbContext
    {
        public IotDbContext() { }

        public IotDbContext(DbContextOptions<IotDbContext> options) : base(options) { }

        public virtual DbSet<Device> Device { get; set; }

        public virtual DbSet<Zone> Zone { get; set; }
        public virtual DbSet<OauthCode> OauthCode { get; set; }

        public virtual DbSet<OauthClient> OauthClient { get; set; }

        public virtual DbSet<OauthClientRedirectUri> OauthClientRedirectUri { get; set; }

        public virtual DbSet<DeviceState> DeviceState { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<OauthCode>(entity =>
            {
                entity.HasIndex(p => new { p.Code });
            });

            modelBuilder.Entity<OauthClient>(entity =>
            {
                entity.HasIndex(p => new { p.ClientId }).IsUnique();
            });

            modelBuilder.Entity<Device>(entity =>
            {
                entity.HasIndex(p => new { p.Name });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasOne(p => p.Zone).WithMany().HasForeignKey(p => p.ZoneId);
            });

            modelBuilder.Entity<DeviceState>(entity =>
            {
                entity.HasIndex(p => new { p.Pin });
                entity.HasIndex(p => new { p.Mode });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasOne(p => p.Device).WithMany().HasForeignKey(p => p.DeviceId);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);


    }
}