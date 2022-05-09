using System;
using System.Data;
using System.Data.Common;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Homo.AuthApi;

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

        public virtual DbSet<DevicePinSwitch> DevicePinSwitch { get; set; }
        public virtual DbSet<DevicePinSensor> DevicePinSensor { get; set; }
        public virtual DbSet<DevicePinName> DevicePinName { get; set; }
        public virtual DbSet<Trigger> Trigger { get; set; }
        public virtual DbSet<TriggerLog> TriggerLog { get; set; }
        public virtual DbSet<Subscription> Subscription { get; set; }
        public virtual DbSet<Transaction> Transaction { get; set; }
        public virtual DbSet<ThirdPartyPaymentFlow> ThirdPartyPaymentFlow { get; set; }
        public virtual DbSet<DeviceActivityLog> DeviceActivityLog { get; set; }
        public virtual DbSet<SystemConfig> SystemConfig { get; set; }
        public virtual DbSet<FirmwareBundleLog> FirmwareBundleLog { get; set; }
        public virtual DbSet<Microcontroller> Microcontroller { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<OauthCode>(entity =>
            {
                entity.HasIndex(p => new { p.Code });
            });

            modelBuilder.Entity<OauthClient>(entity =>
            {
                entity.HasIndex(p => new { p.ClientId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.OwnerId, p.ClientId, p.DeletedAt }).IsUnique();
                entity.HasIndex(p => new { p.ClientId, p.DeletedAt }).IsUnique();
                entity.HasIndex(p => new { p.DeviceId });
            });

            modelBuilder.Entity<Device>(entity =>
            {
                entity.HasIndex(p => new { p.Name });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.Online });
                entity.HasIndex(p => new { p.Microcontroller });
                entity.HasOne(p => p.Zone).WithMany().HasForeignKey(p => p.ZoneId);
            });

            modelBuilder.Entity<DevicePinSwitch>(entity =>
            {
                entity.HasIndex(p => new { p.Pin });
                entity.HasIndex(p => new { p.Mode });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasOne(p => p.Device).WithMany().HasForeignKey(p => p.DeviceId);
            });

            modelBuilder.Entity<DevicePinSensor>(entity =>
            {
                entity.HasIndex(p => new { p.Pin });
                entity.HasIndex(p => new { p.Mode });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasOne(p => p.Device).WithMany().HasForeignKey(p => p.DeviceId);
            });

            modelBuilder.Entity<DevicePinName>(entity =>
            {
                entity.HasIndex(p => new { p.Pin });
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasIndex(p => new { p.OwnerId });
            });

            modelBuilder.Entity<Trigger>(entity =>
            {
                entity.HasIndex(p => new { p.SourcePin });
                entity.HasIndex(p => new { p.SourceDeviceId });
                entity.HasIndex(p => new { p.DestinationPin });
                entity.HasIndex(p => new { p.DestinationDeviceId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasOne(p => p.SourceDevice).WithMany().HasForeignKey(p => p.SourceDeviceId);
                entity.HasOne(p => p.DestinationDevice).WithMany().HasForeignKey(p => p.DestinationDeviceId);
            });

            modelBuilder.Entity<TriggerLog>(entity =>
            {
                entity.HasIndex(p => new { p.CreatedAt });
            });

            modelBuilder.Entity<Subscription>(entity =>
            {
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.PricingPlan });
                entity.HasIndex(p => new { p.StartAt });
                entity.HasIndex(p => new { p.EndAt });
                entity.HasIndex(p => new { p.TransactionId });
                entity.Property(b => b.StopNextSubscribed)
                    .HasDefaultValueSql("0");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.CreatedAt });
                entity.HasIndex(p => new { p.ExternalTransactionId });
                entity.HasIndex(p => new { p.Status });
            });

            modelBuilder.Entity<ThirdPartyPaymentFlow>(entity =>
            {
                entity.HasIndex(p => new { p.CreatedAt });
                entity.HasIndex(p => new { p.ExternalTransactionId });
            });

            modelBuilder.Entity<DeviceActivityLog>(entity =>
            {
                entity.HasIndex(p => new { p.CreatedAt });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.DeviceId });
            });

            modelBuilder.Entity<SystemConfig>(entity =>
            {
                entity.HasIndex(p => new { p.Key });
                entity.HasIndex(p => new { p.Value });
            });

            modelBuilder.Entity<FirmwareBundleLog>(entity =>
            {
                entity.HasIndex(p => new { p.DeviceId });
                entity.HasIndex(p => new { p.OwnerId });
                entity.HasIndex(p => new { p.BundleId });
                entity.HasIndex(p => new { p.BundleId, p.DeletedAt }).IsUnique();
            });

            modelBuilder.Entity<Microcontroller>(entity =>
            {
                entity.HasIndex(p => new { p.CreatedBy });
                entity.HasIndex(p => new { p.CreatedAt });
                entity.HasIndex(p => new { p.DeletedAt });
                entity.HasIndex(p => new { p.DeletedAt, p.Key }).IsUnique();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);


    }
}