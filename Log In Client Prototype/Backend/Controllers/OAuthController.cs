using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Requests;
using Google.Apis.Auth.OAuth2.Web;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace MyProjectName.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly GoogleAuthorizationCodeFlow _flow;

/*        public AuthController(GoogleAuthorizationCodeFlow flow)
        {
            _flow = flow;
        }*/
        public AuthController(GoogleAuthorizationCodeFlow flow)
        {
            var initializer = new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = "304557199927-ukjfv21iahodm0cd9rpqglqgtk0cqolc.apps.googleusercontent.com",
                    ClientSecret = "u5CbEkYgcBefSKVbhj63Wqv4VjGz"
                },
                Scopes = new[] { "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile" },
                DataStore = new FileDataStore("MyProjectName")
            };

            _flow = new GoogleAuthorizationCodeFlow(initializer);

        }

        [HttpGet("login")]
        public IActionResult Login()
        {
            var state = Guid.NewGuid().ToString() + ":";
/*            HttpContext.Session.SetString("state", state);*/

            var url = new GoogleAuthorizationCodeRequestUrl(new Uri("https://accounts.google.com/o/oauth2/auth"))
            {
                ClientId = "304557199927-ukjfv21iahodm0cd9rpqglqgtk0cqolc.apps.googleusercontent.com",
                RedirectUri = Request.Scheme + "://" + Request.Host + "/auth/callback",
                Scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
                ResponseType = "code",
                AccessType = "offline",
                ApprovalPrompt = "force",
                State = state
            }.Build();

            return Redirect(url.ToString());
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {

            var returnUrl = state.Split(':')[0] + "://" + state.Split(':')[1] + "/";
            var token = await _flow.ExchangeCodeForTokenAsync("user", code, returnUrl, new CancellationToken());
            var credential = new UserCredential(_flow, "user", token);
            var service = new Oauth2Service(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential,
                ApplicationName = "MyProjectName"
            });

            var userInfo = await service.Userinfo.Get().ExecuteAsync();

            return Ok();

        }
    }
}