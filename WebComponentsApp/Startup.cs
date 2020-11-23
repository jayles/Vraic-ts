using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace WebComponentsApp
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
			Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
			services.AddRazorPages();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
				app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }

      app.UseHttpsRedirection();

			// for Development builds, add node_modules & Components folder
			// for Production build, need to copy files to wwwroot, minify, AWS deployment will take care of upload
			app.UseStaticFiles();
			if (env.IsDevelopment())
			{
				// add Project root folder
				app.UseStaticFiles(new StaticFileOptions()
				{
					FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory())),
					RequestPath = new PathString("")
				});

				//// add node_modules folder
				//app.UseStaticFiles(new StaticFileOptions()
				//{
				//	FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"node_modules")),
				//	RequestPath = new PathString("/node_modules")
				//});

				//// add Components folder
				//app.UseStaticFiles(new StaticFileOptions()
				//{
				//	FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Components")),
				//	RequestPath = new PathString("/Components")
				//});
			}

			app.UseRouting();

      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapRazorPages();
      });
    }
  }
}
