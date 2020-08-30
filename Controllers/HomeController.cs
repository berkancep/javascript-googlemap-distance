using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using GoogleMapDistance.Models;

namespace GoogleMapDistance.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }


        public JsonResult GetLocations()
        {
            var locations = new List<LocationViewModel>();

            locations.Add(new LocationViewModel
            {
                Name = "Gimsa",
                Latitude = 39.948242,
                Longitude = 32.60964
            });

            locations.Add(new LocationViewModel
            {
                Name = "Park Market",
                Latitude = 40.0051026,
                Longitude = 32.6394972
            });

            locations.Add(new LocationViewModel
            {
                Name = "Umut Market",
                Latitude = 39.9620962,
                Longitude = 32.6010016
            });

            locations.Add(new LocationViewModel
            {
                Name = "Yedi Nokta Market",
                Latitude = 39.9536486,
                Longitude = 32.6335106
            });

            return Json(locations);
        }
    }
}
