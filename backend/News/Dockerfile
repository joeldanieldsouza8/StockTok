FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore
COPY ["backend/News/News.csproj", "backend/News/"]
RUN dotnet restore "backend/News/News.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/backend/News"
RUN dotnet build "News.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "News.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "News.dll"]