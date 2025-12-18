using System.Net.NetworkInformation;

namespace Social.Utilities
{
    public class Utility
    {

        public static string generateSalt()
        {
            Guid guid = Guid.NewGuid();

            string base64 = Convert.ToBase64String(guid.ToByteArray());

            string shortId = base64.Replace('+', '-').Replace('/', '_')
                               .Substring(0, 10);

            return shortId;
        }
    }
}
